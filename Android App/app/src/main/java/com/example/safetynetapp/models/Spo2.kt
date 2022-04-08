package com.example.safetynetapp.models

import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp
import java.util.*

class Spo2(
    override val title: String = "Oxygen Saturation",
    override val units: String = "%",
    override var cardData: String = "--$units",
    override var cardTimestamp: String = "--",
    override val dataType: DataType? = null,
    var spo2s: SortedMap<String, Int> = sortedMapOf<String, Int>()
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
        if (dp == null) {
            return defaultVal
        } else {
            // Get data from Maximo
            return defaultVal
        }
    }


}