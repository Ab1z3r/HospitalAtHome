package com.example.safetynetapp.ui

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.safetynetapp.databinding.FragmentProfileBinding
import com.example.safetynetapp.models.UserViewModel

class ProfileFragment : Fragment() {

    private lateinit var binding: FragmentProfileBinding
    private lateinit var model: UserViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentProfileBinding.inflate(inflater, container, false)
        model = ViewModelProvider(requireActivity()).get(UserViewModel::class.java)

        updateView()

        return binding.root
    }

    fun updateView() {
        with (model.user!!) {
            Log.d("TAG", "in profile update view")
            Log.d("TAG", "$userPictureURI, $displayName, $username")
            binding.profileFirstName.text = firstName
            binding.profileLastName.text = lastName
            binding.profileEmail.text = email
            binding.profilePhone.text = phone
            binding.profileBirthday.text = birthdate
            binding.profileGender.text = gender
            binding.profileCountry.text = country
        }
    }
}