package com.example.safetynetapp.models

import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.RequestQueue
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentReference
import java.util.*

class Spo2(
    override val title: String = "Oxygen Saturation",
    override val units: String = "%",
    override var cardData: String = "--$units",
    override var cardTimestamp: String = "--",
    override val dataType: DataType? = null,
    var spo2s: SortedMap<String, Any> = sortedMapOf<String, Any>()
) : Vital {
    override fun updateCard() {
        if (spo2s.isNotEmpty()) {
            val key = spo2s.keys.elementAt(spo2s.size-1)
            val spo2 = spo2s[key]
            cardData = "${spo2.toString().toFloat().toInt()}$units"
            cardTimestamp = mapKeyToString(key)
        }
        super.updateCard()
    }

    override fun setModelData(map: SortedMap<String, Any>) {
        spo2s = map
    }

    override fun setDiastolicData(map: SortedMap<String, Any>) {
        Log.d("[ERROR]", "should never be here")
    }

    override fun addData(timestamp: String, data: String, ref: DocumentReference) {
        spo2s.set(timestamp, data)
        ref.update("spo2", spo2s)
    }

    override fun dataSize() : Int {
        return spo2s.size
    }

    override fun getData() = spo2s

    override fun fetchVital(
        callingActivity: AppCompatActivity,
        googleSignInAccount: GoogleSignInAccount,
        dataType: DataType?,
        defaultVal: String,
        mRequestQueue: RequestQueue,
        dashboardAdapter: DashboardViewModel
    ) {
    }

    override fun dataPointToValueString(dp: DataPoint, defaultVal: String): String {
        if (dp == null) {
            return defaultVal
        } else {
            // Get data from Maximo
            return defaultVal
        }
    }


}