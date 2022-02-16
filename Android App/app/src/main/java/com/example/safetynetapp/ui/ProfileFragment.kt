package com.example.safetynetapp.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.safetynetapp.databinding.FragmentProfileBinding

class ProfileFragment : Fragment() {

    private lateinit var binding: FragmentProfileBinding
//    private lateinit var model: UserViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentProfileBinding.inflate(inflater, container, false)

        initializeTextFields()

        return binding.root
    }

    fun initializeTextFields() {

    }
}