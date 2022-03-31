package com.example.safetynetapp.models

import androidx.lifecycle.ViewModel

class VitalDetaiViewModel : ViewModel() {

    var data = arrayListOf(0,50,24,3,23,51)
    var currentPos = 0

    fun getDataAt(pos: Int) = data[pos]

    fun updatePos(pos: Int) {
        currentPos = pos
    }
}
