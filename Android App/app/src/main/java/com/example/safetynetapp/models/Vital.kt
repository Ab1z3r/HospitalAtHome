package com.example.safetynetapp.models

import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp

interface Vital {
    val title: String
    val units: String
    val cardData: String
    val cardTimestamp: String
    val dataType: DataType?

    fun timestampToString(time: Timestamp) : String{
        return "%02d/%02d/%d, %02d:%02d".format(time.toDate().month +1, time.toDate().date, time.toDate().year+1900, time.toDate().hours, time.toDate().minutes)
    }

    fun fetchVital(callingActivity: AppCompatActivity, googleSignInAccount: GoogleSignInAccount, dataType: DataType, textView:TextView, defaultVal: String)

    fun dataPointToValueString(dp: DataPoint?, defaultVal: String): String

}