package com.example.safetynetapp.models

import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp
import java.util.*
import kotlin.math.roundToLong

class Pulse(
    override val title: String = "Pulse",
    override val units: String = "bpm",
    override var cardData: String = "-- $units",
    override var cardTimestamp: String = "--",
    override val dataType: DataType? = DataType.TYPE_HEART_RATE_BPM,
    var pulses: SortedMap<String, Int> = sortedMapOf<String, Int>()
) : Vital {
    override fun updateCard() {
        if (pulses.isNotEmpty()) {
            val key = pulses.keys.elementAt(pulses.size-1)
            val pulse = pulses[key]
            cardData = "$pulse $units"
            cardTimestamp = mapKeyToString(key)
        }
        super.updateCard()
    }

    override fun fetchVital(
        callingActivity: AppCompatActivity,
        googleSignInAccount: GoogleSignInAccount,
        dataType: DataType?,
        textView: TextView,
        defaultVal: String
    ) {
        Fitness.getHistoryClient(callingActivity, googleSignInAccount)
            .readDailyTotal(dataType!!)
            .addOnSuccessListener { response ->
                Log.d("[INFO]", response.dataPoints.toString())
                if(response.dataPoints.size == 0){
                    textView.text = defaultVal
                }else{
                    textView.text = dataPointToValueString(response.dataPoints[0], defaultVal)
                }
            }
            .addOnFailureListener { e ->
                Log.w("[ERROR]", "There was an error reading data from Google Fit", e)
                textView.text = defaultVal
            }
    }

    override fun dataPointToValueString(dp: DataPoint?, defaultVal: String): String {
        var pulseInBpm = dp!!.getValue(dp.dataType.fields[0]).asFloat().roundToLong()
        return pulseInBpm.toString()
    }


}
