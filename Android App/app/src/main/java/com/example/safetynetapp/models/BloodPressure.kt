package com.example.safetynetapp.models

import android.widget.TextView
import com.google.firebase.Timestamp

class BloodPressure(
    override val title: String = "Blood Pressure",
    override val units: String = "",
    override val cardData: String = "--/-- $units",
    override val cardTimestamp: String = "--"
) : Vital {


}