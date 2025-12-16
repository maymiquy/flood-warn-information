<?php

namespace Database\Seeders;

use App\Models\Sensor;
use Illuminate\Database\Seeder;

class SensorSeeder extends Seeder
{
    private array $sensors = [
        [
            'name' => 'Sensor Pintu Air Manggarai',
            'code' => 'SNS-MGR001',
            'latitude' => -6.2095,
            'longitude' => 106.8503,
            'status' => 'warning',
            'water_level' => 75.50,
            'address' => 'Pintu Air Manggarai, Menteng, Jakarta Pusat',
            'description' => 'Sensor utama pemantau ketinggian air di Pintu Air Manggarai, titik kritis aliran Kali Ciliwung.',
        ],
        [
            'name' => 'Sensor Kali Ciliwung Kampung Melayu',
            'code' => 'SNS-KML002',
            'latitude' => -6.2256,
            'longitude' => 106.8646,
            'status' => 'danger',
            'water_level' => 125.80,
            'address' => 'Kampung Melayu, Jatinegara, Jakarta Timur',
            'description' => 'Sensor pemantau di area Kampung Melayu yang sering terdampak banjir.',
        ],
        [
            'name' => 'Sensor Waduk Pluit',
            'code' => 'SNS-PLT003',
            'latitude' => -6.1198,
            'longitude' => 106.7963,
            'status' => 'safe',
            'water_level' => 35.20,
            'address' => 'Waduk Pluit, Penjaringan, Jakarta Utara',
            'description' => 'Sensor pemantau di Waduk Pluit, reservoir penting untuk pengendalian banjir Jakarta Utara.',
        ],
        [
            'name' => 'Sensor Kali Pesanggrahan',
            'code' => 'SNS-PSG004',
            'latitude' => -6.2589,
            'longitude' => 106.7654,
            'status' => 'safe',
            'water_level' => 28.40,
            'address' => 'Kali Pesanggrahan, Kebayoran Lama, Jakarta Selatan',
            'description' => 'Sensor pemantau di Kali Pesanggrahan area Jakarta Selatan.',
        ],
        [
            'name' => 'Sensor Kali Sunter',
            'code' => 'SNS-SNT005',
            'latitude' => -6.1456,
            'longitude' => 106.8912,
            'status' => 'warning',
            'water_level' => 68.90,
            'address' => 'Kali Sunter, Tanjung Priok, Jakarta Utara',
            'description' => 'Sensor pemantau di Kali Sunter, salah satu sungai utama Jakarta Utara.',
        ],
        [
            'name' => 'Sensor Waduk Ria Rio',
            'code' => 'SNS-RIO006',
            'latitude' => -6.1876,
            'longitude' => 106.8789,
            'status' => 'safe',
            'water_level' => 42.30,
            'address' => 'Waduk Ria Rio, Pulogadung, Jakarta Timur',
            'description' => 'Sensor pemantau di Waduk Ria Rio, area rekreasi dan pengendalian banjir.',
        ],
        [
            'name' => 'Sensor Kali Krukut',
            'code' => 'SNS-KRK007',
            'latitude' => -6.2345,
            'longitude' => 106.8234,
            'status' => 'warning',
            'water_level' => 85.60,
            'address' => 'Kali Krukut, Tanah Abang, Jakarta Pusat',
            'description' => 'Sensor pemantau di Kali Krukut yang melintasi pusat kota Jakarta.',
        ],
        [
            'name' => 'Sensor Kali Angke',
            'code' => 'SNS-AGK008',
            'latitude' => -6.1567,
            'longitude' => 106.7432,
            'status' => 'safe',
            'water_level' => 22.10,
            'address' => 'Kali Angke, Cengkareng, Jakarta Barat',
            'description' => 'Sensor pemantau di Kali Angke, area Jakarta Barat.',
        ],
        [
            'name' => 'Sensor Waduk Melati',
            'code' => 'SNS-MLT009',
            'latitude' => -6.1723,
            'longitude' => 106.8567,
            'status' => 'safe',
            'water_level' => 31.70,
            'address' => 'Waduk Melati, Kemayoran, Jakarta Pusat',
            'description' => 'Sensor pemantau di Waduk Melati, Jakarta Pusat.',
        ],
        [
            'name' => 'Sensor Kali Mookervart',
            'code' => 'SNS-MKV010',
            'latitude' => -6.1834,
            'longitude' => 106.7123,
            'status' => 'danger',
            'water_level' => 142.50,
            'address' => 'Kali Mookervart, Kalideres, Jakarta Barat',
            'description' => 'Sensor pemantau di Kali Mookervart, sering terdampak luapan air.',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->sensors as $sensorData) {
            Sensor::create([
                ...$sensorData,
                'is_active' => true,
                'last_reading_at' => now()->subMinutes(rand(1, 60)),
            ]);
        }

        $this->command->info('✅ Success');
    }
}
