package edu.rosehulman.testapp

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import edu.rosehulman.testapp.databinding.FragmentDeviceListBinding

class DeviceListFragment : Fragment() {

    private lateinit var binding: FragmentDeviceListBinding

    private lateinit var mListener: EventListener

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentDeviceListBinding.inflate(inflater, container, false)

        binding.fab.setOnClickListener {
            mListener.onFragmentEvent(Event.AddDevice, Bundle())
        }

        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_device_list, container, false)
    }

    interface EventListener {
        fun onFragmentEvent(event: Event, args: Bundle?)
    }

    enum class Event {
        TransferToDevice, DeviceInfo, AddDevice
    }
}