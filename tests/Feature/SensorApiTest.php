<?php

namespace Tests\Feature;

use App\Models\Sensor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SensorApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_sensors_list(): void
    {
        Sensor::factory()->count(5)->create();

        $response = $this->getJson('/api/sensors');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'total',
                'stats',
            ])
            ->assertJson([
                'success' => true,
                'total' => 5,
            ]);
    }

    public function test_can_filter_sensors_by_status(): void
    {
        Sensor::factory()->count(3)->create(['status' => Sensor::STATUS_SAFE]);
        Sensor::factory()->count(2)->create(['status' => Sensor::STATUS_DANGER]);

        $response = $this->getJson('/api/sensors?status=safe');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_get_single_sensor(): void
    {
        $sensor = Sensor::factory()->create();

        $response = $this->getJson("/api/sensors/{$sensor->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_create_sensor(): void
    {
        $sensorData = [
            'name' => 'New Sensor',
            'code' => 'NEW-001',
            'latitude' => -6.2088,
            'longitude' => 106.8456,
            'status' => 'safe',
            'water_level' => 1.5,
            'address' => 'Test Address',
        ];

        $response = $this->postJson('/api/sensors', $sensorData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Sensor berhasil ditambahkan.',
            ]);

        $this->assertDatabaseHas('sensors', [
            'name' => 'New Sensor',
            'code' => 'NEW-001',
        ]);
    }

    public function test_sensor_creation_requires_name(): void
    {
        $sensorData = [
            'code' => 'NEW-001',
            'latitude' => -6.2088,
            'longitude' => 106.8456,
        ];

        $response = $this->postJson('/api/sensors', $sensorData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_update_sensor(): void
    {
        $sensor = Sensor::factory()->create();

        $updateData = [
            'name' => 'Updated Sensor Name',
            'code' => $sensor->code,
            'latitude' => $sensor->latitude,
            'longitude' => $sensor->longitude,
        ];

        $response = $this->putJson("/api/sensors/{$sensor->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Sensor berhasil diperbarui.',
            ]);

        $this->assertDatabaseHas('sensors', [
            'id' => $sensor->id,
            'name' => 'Updated Sensor Name',
        ]);
    }

    public function test_can_delete_sensor(): void
    {
        $sensor = Sensor::factory()->create();

        $response = $this->deleteJson("/api/sensors/{$sensor->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Sensor berhasil dihapus.',
            ]);

        $this->assertDatabaseMissing('sensors', [
            'id' => $sensor->id,
        ]);
    }

    public function test_can_get_map_markers(): void
    {
        Sensor::factory()->count(3)->create();

        $response = $this->getJson('/api/sensors/markers');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'total',
            ]);
    }

    public function test_can_update_sensor_status(): void
    {
        $sensor = Sensor::factory()->create([
            'water_level' => 1.0,
            'status' => Sensor::STATUS_SAFE,
        ]);

        $response = $this->patchJson("/api/sensors/{$sensor->id}/status", [
            'water_level' => 5.0,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_update_status_requires_water_level(): void
    {
        $sensor = Sensor::factory()->create();

        $response = $this->patchJson("/api/sensors/{$sensor->id}/status", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['water_level']);
    }
}
