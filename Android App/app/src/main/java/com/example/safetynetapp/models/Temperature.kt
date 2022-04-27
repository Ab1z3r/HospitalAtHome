package com.example.safetynetapp.models

import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.RequestQueue
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp
import java.util.*

class Temperature(
    override val title: String = "Temperature",
    override val units: String = "\u00B0F",
    override var cardData: String = "--$units",
    override var cardTimestamp: String = "--",
    override val dataType: DataType? = null,
    var temperatures: SortedMap<String, Any> = sortedMapOf<String, Any>()
) : Vital {
    override fun updateCard() {
        if (temperatures.isNotEmpty()) {
            val key = temperatures.keys.elementAt(temperatures.size-1)
            val temperature = temperatures[key]
            cardData = "$temperature$units"
            cardTimestamp = mapKeyToString(key)
        }
        super.updateCard()
    }

    override fun setModelData(map: SortedMap<String, Any>) {
        temperatures = map
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
    }

    override fun dataPointToValueString(dp: DataPoint, defaultVal: String): String {
        if(dp == null){
            return defaultVal
        }else{
            // Get data from Maximo
            return defaultVal
        }    }


}