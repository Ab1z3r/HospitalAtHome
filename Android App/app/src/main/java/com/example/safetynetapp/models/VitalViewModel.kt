package com.example.safetynetapp.models

import androidx.lifecycle.ViewModel
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase

class VitalViewModel : ViewModel() {

    lateinit var googleSigninUser: GoogleSignInAccount
    lateinit var ref: DocumentReference

    var data = arrayListOf<Float>()
    var currentPos = 0

    fun getVitalAt(pos: Int) = data[pos]

    fun updatePos(pos: Int) {
        currentPos = pos
    }

    fun populateData() {
        val uid = googleSigninUser.id!!
        ref = Firebase.firestore.collection(User.COLLECTION_PATH).document(uid)

        ref.get().addOnSuccessListener { snapshot: DocumentSnapshot ->
            if (snapshot.exists()) {

            }
        }

    }

}
