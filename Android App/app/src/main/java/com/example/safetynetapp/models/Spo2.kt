package com.example.safetynetapp.models

import android.widget.TextView
import com.google.firebase.Timestamp

class Spo2(
    override val title: String = "Blood Saturation",
    override val units: String = "%",
    override val cardData: String = "--$units",
    override val cardTimestamp: String = "--"
) : Vital {


}