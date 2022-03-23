package com.example.safetynetapp.ui

import android.os.Bundle
import android.util.Log
import android.view.*
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import coil.load
import coil.transform.CircleCropTransformation
import com.example.safetynetapp.R
import com.example.safetynetapp.databinding.FragmentProfileBinding
import com.example.safetynetapp.models.UserViewModel

class ProfileFragment : Fragment() {

    private lateinit var binding: FragmentProfileBinding
    private lateinit var model: UserViewModel


    override fun onCreate( savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setHasOptionsMenu(true)
    }

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

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.profile_menu, menu)
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem) = when (item.itemId) {
        R.id.action_edit_profile -> {
            findNavController().navigate(R.id.nav_profile_edit)
            true
        }

        else -> {
            super.onOptionsItemSelected(item)
        }
    }

    fun navToEditProfile() {
        findNavController().navigate(R.id.nav_profile_edit)
    }

    fun updateView() {
        with (model.user!!) {
            Log.d("TAG", "in profile update view")
            Log.d("TAG", "$userPictureURI, $displayName, $username")
            binding.profileFirstName.text = firstName
            binding.profileLastName.text = lastName
            binding.profileEmail.text = email
            binding.profilePhone.text = phone
            binding.profileBirthday.text = birthdate.toString()
            binding.profileGender.text = gender
            binding.profileEmContactName.text = emContactName
            binding.profileEmContactPhone.text = emContactPhone
            binding.profileImage.load(userPictureURI) {
                crossfade(true)
                transformations(CircleCropTransformation())
            }
        }
    }
}