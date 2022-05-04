package com.example.safetynetapp.ui

import android.os.Bundle
import android.view.*
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.example.safetynetapp.HomeViewModel
import com.example.safetynetapp.R
import com.example.safetynetapp.databinding.FragmentSettingsBinding

class SettingsFragment : Fragment() {

    private lateinit var binding: FragmentSettingsBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSettingsBinding.inflate(inflater, container, false)

        binding.settingsTemperatureUnits.setOnClickListener {
            val text = "Feature Still Under Development"
            Toast.makeText(requireContext(), text, Toast.LENGTH_LONG).show()
        }

        binding.settingsWeightUnits.setOnClickListener {
            val text = "Feature Still Under Development"
            Toast.makeText(requireContext(), text, Toast.LENGTH_LONG).show()
        }

        binding.settingsHeightUnits.setOnClickListener {
            val text = "Feature Still Under Development"
            Toast.makeText(requireContext(), text, Toast.LENGTH_LONG).show()

        }

        return binding.root
    }

}