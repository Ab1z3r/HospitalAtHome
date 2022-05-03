package com.example.safetynetapp.ui

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.example.safetynetapp.R
import com.example.safetynetapp.databinding.FragmentAddVitalDialogBinding
import com.example.safetynetapp.models.DashboardViewModel
import com.example.safetynetapp.models.Vital
import com.google.firebase.Timestamp

private lateinit var model: DashboardViewModel
private lateinit var binding: FragmentAddVitalDialogBinding


class AddVitalDialogFragment : DialogFragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val model = ViewModelProvider(requireActivity()).get(DashboardViewModel::class.java)

        binding = FragmentAddVitalDialogBinding.inflate(inflater, container, false)

        binding.addVitalAddButton.setOnClickListener {
            if (binding.addVitalData.text.isNotEmpty()) {
                val data = binding.addVitalData.text.toString()
                val timestamp = model.getVitalAt(model.currentPos).timestampToMapKey(Timestamp.now())
                val ref = model.ref
                model.getVitalAt(model.currentPos).addData(timestamp, data, ref)
                this.dismiss()
            }
        }

        return binding.root
    }

    companion object {
        const val TAG = "PurchaseConfirmationDialog"
    }

}