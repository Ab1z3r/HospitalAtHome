package com.example.safetynetapp.models

import android.widget.TextView
import com.google.firebase.Timestamp

class Weight(
    override val title: String = "Weight",
    override val units: String = "lbs",
    override val cardData: String = "-- $units",
    override val cardTimestamp: String = "--"
) : Vital {


}