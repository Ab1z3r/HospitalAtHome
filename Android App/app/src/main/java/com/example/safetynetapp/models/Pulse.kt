package com.example.safetynetapp.models

import android.widget.TextView
import com.google.firebase.Timestamp

class Pulse(
    override val title: String = "Pulse",
    override val units: String = "bpm",
    override val cardData: String = "-- $units",
    override val cardTimestamp: String = "--"
) : Vital {


}