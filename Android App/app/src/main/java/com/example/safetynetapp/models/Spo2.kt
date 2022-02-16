package com.example.safetynetapp.models

import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp

class Spo2(
    override val title: String = "Blood Saturation",
    override val units: String = "%",
    override val cardData: String = "--$units",
    override val cardTimestamp: String = "--",
    override val dataType: DataType? = null
) : Vital {
    override fun fetchVital(
        callingActivity: AppCompatActivity,
        googleSignInAccount: GoogleSignInAccount,
        dataType: DataType,
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
        }
    }


}