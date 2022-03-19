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
import com.example.safetynetapp.databinding.FragmentProfileEditBinding
import com.example.safetynetapp.models.UserViewModel

class ProfileEditFragment : Fragment() {

    private lateinit var binding: FragmentProfileEditBinding
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
        binding = FragmentProfileEditBinding.inflate(inflater, container, false)
        model = ViewModelProvider(requireActivity()).get(UserViewModel::class.java)

        updateView()

        return binding.root
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.profile_edit_menu, menu)
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem) = when (item.itemId) {
        R.id.action_save_profile -> {
            findNavController().navigate(R.id.nav_profile)
            true
        }

        else -> {
            super.onOptionsItemSelected(item)
        }
    }

    fun updateView() {
        with (model.user!!) {
            Log.d("TAG", "in profile update view")
            Log.d("TAG", "$userPictureURI, $displayName, $username")
            binding.profileEditFirstName.setText(firstName)
            binding.profileEditLastName.setText(lastName)
            binding.profileEditEmail.setText(email)
            binding.profileEditPhone.setText(phone)
            binding.profileEditBirthday.setText(birthdate.toString())
            binding.profileEditGender.setText(gender)
            binding.profileEditImage.load(userPictureURI) {
                crossfade(true)
                transformations(CircleCropTransformation())
            }
        }
    }
}