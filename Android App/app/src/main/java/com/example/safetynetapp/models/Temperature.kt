package com.example.safetynetapp.models

import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
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
    var temperatures: SortedMap<String, Int> = sortedMapOf<String, Int>()
) : Vital {
    override fun fetchVital(
        callingActivity: AppCompatActivity,
        googleSignInAccount: GoogleSignInAccount,
        dataType: DataType?,
        textView: TextView,
        defaultVal: String
    ) {
        textView.text = dataPointToValueString(null, defaultVal)
    }

    override fun dataPointToValueString(dp: DataPoint?, defaultVal: String): String {
        if(dp == null){
            return defaultVal
        }else{
            // Get data from Maximo
            return defaultVal
        }    }


}