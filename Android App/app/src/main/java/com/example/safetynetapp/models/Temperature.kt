package com.example.safetynetapp.models

import android.widget.TextView
import com.google.firebase.Timestamp

class Temperature(
    override val title: String = "Temperature",
    override val units: String = "\u00B0F",
    override val cardData: String = "--$units",
    override val cardTimestamp: String = "--"
) : Vital {


}