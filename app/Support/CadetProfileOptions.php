<?php

namespace App\Support;

class CadetProfileOptions
{
    public const JOB_TYPES = [
        'Police',
        'Defence',
        'Govt Job',
        'Doctor',
        'Lawyer',
        'Engineer',
        'Banker',
        'Business',
        'Teacher',
        'Other',
    ];

    public const BLOOD_GROUPS = [
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-',
    ];

    public const HOUSE_COLORS = [
        'Red',
        'Blue',
        'Green',
        'Yellow',
        'Maroon',
        'White',
        'Orange',
        'Purple',
        'Black',
    ];

    public const HOUSES = [
        'FCC' => ['Babur', 'Fazlul Huq', 'Rab', 'Qasim'],
        'JCC' => ['Badr', 'Khaybar', 'Hunain'],
        'MCC' => ['Fazlul Huq', 'Suhrawardy', 'Nazrul', 'Qudrat-i-Khuda'],
        'RCC' => ['Qasim', 'Tariq', 'Khalid'],
        'SCC' => ['Surma', 'Kushiyara', 'Titumir'],
        'CCR' => ['Bir Sreshtho Mustafa', 'Omar', 'Teesta'],
        'BCC' => ['Sher-e-Bangla', 'Suhrawardy', 'Kirtankhola'],
        'PCC' => ['Siraj-ud-Daula', 'Bhashani'],
        'MGCC' => ['Begum Rokeya', 'Pritilata'],
        'CCC' => ['Shanti', 'Mukti', 'Bijoy'],
    ];
}
