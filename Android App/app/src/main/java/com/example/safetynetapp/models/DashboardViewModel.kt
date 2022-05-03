package com.example.safetynetapp.models

import android.util.Log
import androidx.lifecycle.ViewModel
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.*

class DashboardViewModel : ViewModel() {

    lateinit var googleSigninUser: GoogleSignInAccount
    lateinit var ref: DocumentReference

    var vitals = arrayListOf(Pulse(), Spo2(), BloodPressure(), Temperature(), Weight(), Height())
    var currentPos = 0

    var isReady = false

    fun size() = vitals.size

    fun vitalSize(vitalPos: Int) : Int {
        return when (vitalPos) {
            0 -> vitals[0].dataSize()
            1 -> vitals[1].dataSize()
            2 -> vitals[2].dataSize()
            3 -> vitals[3].dataSize()
            4 -> vitals[4].dataSize()
            5 -> vitals[5].dataSize()
            else -> {
                -1
            }
        }
    }

    fun getVitalAt(pos: Int) = vitals[pos]

    fun updatePos(pos: Int) {
        currentPos = pos
    }

    fun addData(position: Int, data: String) {
        val uid = googleSigninUser.id!!
    }

    fun populateVitals() {
        val uid = googleSigninUser.id!!
        ref = Firebase.firestore.collection(User.COLLECTION_PATH).document(uid)
        Log.d("MIKE", "Adding Listener")
        ref.get().addOnSuccessListener { snapshot: DocumentSnapshot ->
            if (snapshot.exists()) {
                vitals[0].setModelData(snapshot.get("pulse")!!.serializeToMap().toSortedMap())
                vitals[1].setModelData(snapshot.get("spo2")!!.serializeToMap().toSortedMap())
                vitals[2].setModelData(snapshot.get("systolicPressure")!!.serializeToMap().toSortedMap())
                vitals[2].setDiastolicData(snapshot.get("diastolicPressure")!!.serializeToMap().toSortedMap())
                vitals[3].setModelData(snapshot.get("temperature")!!.serializeToMap().toSortedMap())
                vitals[4].setModelData(snapshot.get("weight")!!.serializeToMap().toSortedMap())
                vitals[5].setModelData(snapshot.get("height")!!.serializeToMap().toSortedMap())
                isReady = true
            }
        }

    }



    // from https://stackoverflow.com/questions/49860916/how-to-convert-a-kotlin-data-class-object-to-map/59316850#59316850
    val gson = Gson()

    //convert a data class to a map
    fun <T> T.serializeToMap(): Map<String, Any> {
        return convert()
    }

    //convert an object of type I to type O
    inline fun <I, reified O> I.convert(): O {
        val json = gson.toJson(this)
        return gson.fromJson(json, object : TypeToken<O>() {}.type)
    }
}
