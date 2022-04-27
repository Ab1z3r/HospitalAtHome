package com.example.safetynetapp.models

import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.AuthFailureError
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import org.json.JSONObject
import java.util.*
import kotlin.math.roundToLong

class Pulse(
    override val title: String = "Pulse",
    override val units: String = "bpm",
    override var cardData: String = "-- $units",
    override var cardTimestamp: String = "--",
    override val dataType: DataType? = DataType.TYPE_HEART_RATE_BPM,
    var pulses: SortedMap<String, Any> = sortedMapOf<String, Any>()
) : Vital {
    override fun updateCard() {
        if (pulses.isNotEmpty()) {
            val key = pulses.keys.elementAt(pulses.size-1)
            val pulse = pulses[key]
            cardData = "${pulse.toString().toFloat().toInt()} $units"
            cardTimestamp = mapKeyToString(key)
        }
        super.updateCard()
    }

    override fun setModelData(map: SortedMap<String, Any>) {
        pulses = map
    }

    override fun setDiastolicData(map: SortedMap<String, Any>) {
        Log.d("[ERROR]", "should never be here")
    }

    override fun fetchVital(
        callingActivity: AppCompatActivity,
        googleSignInAccount: GoogleSignInAccount,
        dataType: DataType?,
        defaultVal: String,
        mRequestQueue: RequestQueue,
        dashboardAdapter: DashboardViewModel
    ) {
        val url: String = "https://us-central1-safetynet-1636515641171.cloudfunctions.net/updatePatientData/AddHeatlthData"

        Fitness.getHistoryClient(callingActivity, googleSignInAccount)
            .readDailyTotal(dataType!!)
            .addOnSuccessListener { response ->
                if (response.dataPoints.isEmpty()) {
                    Log.d("[INFO]", "No data points exist")
                } else {
                    var mStringRequest = object : StringRequest(Request.Method.POST, url, Response.Listener { response ->
                        Log.i("[INFO]", "Response from upload Data: " + response)
                    }, Response.ErrorListener { error ->
                        Log.i("[INFO]", error.toString());
                    }) {
                        @Throws(AuthFailureError::class)
                        override fun getHeaders(): Map<String, String>? {
                            val params: MutableMap<String, String> = HashMap()
                            params["Content-Type"] = "application/json"
                            return params
                        }

                        @Throws(AuthFailureError::class)
                        override fun getBody(): ByteArray {

                            val rootObject= JSONObject()
                            rootObject.put("uid",googleSignInAccount.id)

                            val dataTypeNameArray = dataType.name.split(".")
                            val dataTypeName = dataTypeNameArray.get(dataTypeNameArray.size - 1)


                            val dp: DataPoint = response.dataPoints[0]
                            rootObject.put(dataTypeName, dp.getValue(dp.dataType.fields[0]).toString())

                            Log.d("[INFO]", rootObject.toString())
                            return rootObject.toString().toByteArray()
                        }
                    }
                    mRequestQueue!!.add(mStringRequest!!)
                }
            }
            .addOnFailureListener { e ->
                Log.w("[ERROR]", "There was an error reading data from Google Fit", e)
            }
    }

    override fun dataPointToValueString(dp: DataPoint, defaultVal: String): String {
        var pulseInBpm = dp!!.getValue(dp.dataType.fields[0]).asFloat().roundToLong()
        return pulseInBpm.toString()
    }


}
