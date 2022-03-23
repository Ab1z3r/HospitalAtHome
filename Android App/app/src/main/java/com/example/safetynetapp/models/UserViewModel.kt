package com.example.safetynetapp.models

import android.util.Log
import androidx.lifecycle.ViewModel
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.FitnessOptions
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.util.*

class UserViewModel : ViewModel() {

    var user: User? = null
    lateinit var googleSigninUser: GoogleSignInAccount
    lateinit var fitnessoptions: FitnessOptions

    lateinit var ref: DocumentReference

    fun getOrMakeUser(observer: () -> Unit) {
        ref = Firebase.firestore.collection(User.COLLECTION_PATH).document(googleSigninUser.id!!)
//        ref = Firebase.firestore.collection(User.COLLECTION_PATH)
//            .document("PCN2xo0J2lWGDvLTk61PduYQjmI3")
        observer()
    }

    fun update(
        newFirstName: String,
        newLastName: String,
        newEmail: String,
        newPhone: String,
        newBirthdate: String,
        newGender: String,
        newEmContactName: String,
        newEmContactPhone: String,
    ) {
        ref = Firebase.firestore.collection(User.COLLECTION_PATH).document(googleSigninUser.id!!)
//        ref =
//            Firebase.firestore.collection(User.COLLECTION_PATH)
//                .document("PCN2xo0J2lWGDvLTk61PduYQjmI3")
        Log.d("TAG", googleSigninUser.id.toString())

        with(user!!) {
            firstName = newFirstName
            ref.update("firstName", newFirstName)
            lastName = newLastName
            ref.update("lastName", newLastName)
            email = newEmail
            ref.update("email", newEmail)
            phone = newPhone
            ref.update("phone", newPhone)
            birthdate = newBirthdate
            ref.update("birthdate", newBirthdate)
            gender = newGender
            ref.update("gender", newGender)
            emContactName = newEmContactName
            ref.update("emContactName", newEmContactName)
            emContactPhone = newEmContactPhone
            ref.update("emContactPhone", newEmContactPhone)
        }
    }

    fun populateUserObject() {
        ref = Firebase.firestore.collection(User.COLLECTION_PATH).document(googleSigninUser.id!!)
//        ref =
//            Firebase.firestore.collection(User.COLLECTION_PATH)
//                .document("PCN2xo0J2lWGDvLTk61PduYQjmI3")

        with(user!!) {
            ref.get().addOnSuccessListener { snapshot: DocumentSnapshot ->
                if (snapshot.exists()) {
                    firstName = snapshot.get("firstName").toString()
                    lastName = snapshot.get("lastName").toString()
                    email = snapshot.get("email").toString()
                    phone = snapshot.get("phone").toString()
                    birthdate = snapshot.get("birthdate").toString()
                    gender = snapshot.get("gender").toString()
                    emContactName = snapshot.get("emContactName").toString()
                    emContactPhone = snapshot.get("emContactPhone").toString()
                }
            }
        }
    }
}
