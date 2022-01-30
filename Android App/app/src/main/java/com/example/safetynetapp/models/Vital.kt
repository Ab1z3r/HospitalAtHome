package com.example.safetynetapp.models

import com.google.firebase.Timestamp

interface Vital {
    val title: String
    val units: String
    val cardData: String
    val cardTimestamp: String

    fun timestampToString(time: Timestamp) : String{
        return "%02d/%02d/%d, %02d:%02d".format(time.toDate().month+1, time.toDate().date, time.toDate().year, time.toDate().hours, time.toDate().minutes)
    }
}