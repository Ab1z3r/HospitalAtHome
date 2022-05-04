package com.example.safetynetapp.models

import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.RequestQueue
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentReference
import java.util.*

interface Vital {
    val title: String
    val units: String
    var cardData: String
    var cardTimestamp: String
    val dataType: DataType?


    fun updateCard() {
//        this.cardTimestamp = timestampToString(Timestamp.now())
    }

    fun setModelData(map: SortedMap<String, Any>)
    fun setDiastolicData(map: SortedMap<String, Any>)

    fun addData(timestamp: String, data: String, ref: DocumentReference)

    fun addDiastolicData(timestamp: String, data: String, ref: DocumentReference)

    fun dataSize() : Int

    fun getData() : SortedMap<String, Any>

    fun getDiastolicData() : SortedMap<String, Any>

    fun dataString(data: String, diastolicData: String) : String

    fun fetchVital(
        callingActivity: AppCompatActivity,
        googleSignInAccount: GoogleSignInAccount,
        dataType: DataType?,
        defaultVal: String,
        mRequestQueue: RequestQueue,
        dashboardModel: DashboardViewModel
    )

    fun dataPointToValueString(dp: DataPoint, defaultVal: String): String

    fun timestampToString(time: Timestamp): String {
        return "%02d/%02d/%d, %02d:%02d:%02d".format(
            time.toDate().month + 1,
            time.toDate().date,
            time.toDate().year + 1900,
            time.toDate().hours,
            time.toDate().minutes,
            time.toDate().seconds,
        )
    }

    fun timestampToMapKey(time: Timestamp): String {
        return "%d%02d%02d-%02d:%02d:%02d".format(
            time.toDate().year + 1900,
            time.toDate().month + 1,
            time.toDate().date,
            time.toDate().hours,
            time.toDate().minutes,
            time.toDate().seconds
        )
    }

    fun mapKeyToTimestamp(mapKey: String): Timestamp {
        return Timestamp(
            Date(
                mapKey.substring(0, 4).toInt() - 1900,  //year
                mapKey.substring(4, 6).toInt() - 1,     //month
                mapKey.substring(6, 8).toInt(),             //day
                mapKey.substring(9, 11).toInt(),            //hour
                mapKey.substring(12, 14).toInt(),           //minute
                mapKey.substring(15, 17).toInt(),           //second
            )
        )

    }

    fun mapKeyToString(mapKey: String): String {
        return "%s/%s/%s, %s:%s:%s".format(
            mapKey.substring(4, 6),      //month
            mapKey.substring(6, 8),      //day
            mapKey.substring(0, 4),      //year
            mapKey.substring(9, 11),     //hour
            mapKey.substring(12, 14),    //minute
            mapKey.substring(15, 17),    //second

        )
    }

}