package com.example.safetynetapp.models

import androidx.lifecycle.ViewModel

class DashboardViewModel : ViewModel() {

    var vitals = arrayListOf(Pulse(), Spo2(), BloodPressure(), Temperature(), Weight(), Height())
    var currentPos = 0

    fun size() = vitals.size

    fun getVitalAt(pos: Int) = vitals[pos]

    fun updatePos(pos: Int) {
        currentPos = pos
    }
}
