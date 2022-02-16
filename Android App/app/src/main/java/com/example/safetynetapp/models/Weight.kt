package com.example.safetynetapp.models

import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp
import kotlin.math.roundToInt

class Weight(
    override val title: String = "Weight",
    override val units: String = "lbs",
    override val cardData: String = "-- $units",
    override val cardTimestamp: String = "--",
    override val dataType: DataType? = DataType.TYPE_WEIGHT
) : Vital {
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
                if(response.dataPoints.isEmpty()){
                    textView.text = defaultVal
                }
                textView.text = dataPointToValueString(response.dataPoints[0], defaultVal)
            }
            .addOnFailureListener { e ->
                Log.w("[ERROR]", "There was an error reading data from Google Fit", e)
                textView.text = defaultVal
            }
    }

    override fun dataPointToValueString(dp: DataPoint?, defaultVal: String): String {
        var weightInKGString = dp!!.getValue(dp.dataType.fields[0]).toString()
        var weightInPoundDouble = (weightInKGString.toDouble() * 2.20462).roundToInt()
        return weightInPoundDouble.toString()
    }


}