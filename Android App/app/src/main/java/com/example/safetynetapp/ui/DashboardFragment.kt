package com.example.safetynetapp.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.safetynetapp.HomeViewModel
import com.example.safetynetapp.adapters.DashboardAdapter
import com.example.safetynetapp.databinding.FragmentDashboardBinding
import com.example.safetynetapp.models.DashboardViewModel

class DashboardFragment : Fragment() {

    private lateinit var model: DashboardViewModel
    private lateinit var binding: FragmentDashboardBinding
    private lateinit var adapter: DashboardAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentDashboardBinding.inflate(inflater, container, false)

        adapter = DashboardAdapter(this)
        binding.dashboardRecyclerView.adapter = adapter
        binding.dashboardRecyclerView.layoutManager = LinearLayoutManager(requireContext())
        binding.dashboardRecyclerView.setHasFixedSize(true)

        return binding.root
    }
}