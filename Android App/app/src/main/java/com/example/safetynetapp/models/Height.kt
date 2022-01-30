package com.example.safetynetapp.models

import android.widget.TextView
import com.google.firebase.Timestamp

class Height(
    override val title: String = "Height",
    override val units: String = "",
    override val cardData: String = "-- ft, -- in",
    override val cardTimestamp: String = "--"
) : Vital {

}