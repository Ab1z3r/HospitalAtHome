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

class Height(
    override val title: String = "Height",
    override val units: String = "",
    override var cardData: String = "-- ft, -- in",
    override var cardTimestamp: String = "--",
    override val dataType: DataType? = DataType.TYPE_HEIGHT,
    var heights: SortedMap<String, Any> = sortedMapOf<String, Any>()
) : Vital {
    override fun updateCard() {
        if (heights.isNotEmpty()) {
            val key = heights.keys.elementAt(heights.size-1)
            val height = heights[key]
            val feet = height.toString().toFloat().toInt() / 12
            val inches = height.toString().toFloat().toInt() % 12
            cardData = "$feet ft, $inches in"
            cardTimestamp = mapKeyToString(key)
        }
        super.updateCard()
    }

    override fun setModelData(map: SortedMap<String, Any>) {
        heights = map
    }

    override fun setDiastolicData(map: SortedMap<String, Any>) {
        Log.d("[ERROR]", "should never be here")
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
                if (response.dataPoints.isEmpty()) {
                    textView.text = defaultVal
                } else {
                    textView.text = dataPointToValueString(response.dataPoints[0], defaultVal)
                }
            }
            .addOnFailureListener { e ->
                Log.w("[ERROR]", "There was an error reading data from Google Fit", e)
                textView.text = defaultVal
            }
    }

    override fun dataPointToValueString(dp: DataPoint?, defaultVal: String): String {
        if (dp == null) {
            return defaultVal
        }

        val METERS_PER_FOOT: Double = 0.3048;
        val INCHES_PER_FOOT: Double = 12.0;
        val heightInMetersstr: String = dp.getValue(dp.dataType.fields[0]).toString();
        val heightInMeters: Double = heightInMetersstr.toDouble()
        val heightInFeet = heightInMeters / METERS_PER_FOOT;
        val feet: Int = heightInFeet.toInt();
        val inches: Int = ((heightInFeet - feet) * INCHES_PER_FOOT + 0.5).toInt();
        return feet.toString().plus("''$inches'")
    }


}