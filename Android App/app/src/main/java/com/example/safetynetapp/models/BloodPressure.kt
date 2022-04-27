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

class BloodPressure(
    override val title: String = "Blood Pressure",
    override val units: String = "",
    override var cardData: String = "--/-- $units",
    override var cardTimestamp: String = "--",
    override val dataType: DataType? = null,
    var systolicPressures: SortedMap<String, Any> = sortedMapOf<String, Any>(),
    var diastolicPressures: SortedMap<String, Any> = sortedMapOf<String, Any>(),
) : Vital {
    override fun updateCard() {
        if (systolicPressures.isNotEmpty()) {
            val key = systolicPressures.keys.elementAt(systolicPressures.size-1)
            val systolicPressure = systolicPressures[key]
            val diastolicPressure = diastolicPressures[key]
            cardData = "${systolicPressure.toString().toFloat().toInt()}/${diastolicPressure.toString().toFloat().toInt()} $units"
            cardTimestamp = mapKeyToString(key)
        }
        super.updateCard()
    }

    override fun setModelData(map: SortedMap<String, Any>) {
        systolicPressures = map
    }

    override fun setDiastolicData(map: SortedMap<String, Any>) {
        diastolicPressures = map
    }

    override fun fetchVital(
        callingActivity: AppCompatActivity,
        googleSignInAccount: GoogleSignInAccount,
        dataType: DataType?,
        defaultVal: String,
        mRequestQueue: RequestQueue,
        dashboardAdapter: DashboardViewModel
    ) {}

    override fun dataPointToValueString(dp: DataPoint, defaultVal: String): String {
        if(dp == null){
            return defaultVal
        }else{
            // Get data from Maximo
            return defaultVal
        }

    }


}