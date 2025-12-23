<?php

namespace Tests\Unit;

use App\Models\Sensor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SensorTest extends TestCase
{
    use RefreshDatabase;

    public function test_sensor_can_be_created(): void
    {
        $sensor = Sensor::factory()->create([
            'name' => 'Test Sensor',
            'code' => 'TEST-001',
            'status' => Sensor::STATUS_SAFE,
        ]);

        $this->assertDatabaseHas('sensors', [
            'name' => 'Test Sensor',
            'code' => 'TEST-001',
            'status' => 'safe',
        ]);
    }

    public function test_sensor_has_correct_status_color(): void
    {
        $safeSensor = Sensor::factory()->create(['status' => Sensor::STATUS_SAFE]);
        $warningSensor = Sensor::factory()->create(['status' => Sensor::STATUS_WARNING]);
        $dangerSensor = Sensor::factory()->create(['status' => Sensor::STATUS_DANGER]);

        $this->assertEquals('#22c55e', $safeSensor->status_color);
        $this->assertEquals('#eab308', $warningSensor->status_color);
        $this->assertEquals('#ef4444', $dangerSensor->status_color);
    }

    public function test_sensor_has_correct_status_label(): void
    {
        $safeSensor = Sensor::factory()->create(['status' => Sensor::STATUS_SAFE]);
        $warningSensor = Sensor::factory()->create(['status' => Sensor::STATUS_WARNING]);
        $dangerSensor = Sensor::factory()->create(['status' => Sensor::STATUS_DANGER]);

        $this->assertEquals('Aman', $safeSensor->status_label);
        $this->assertEquals('Siaga', $warningSensor->status_label);
        $this->assertEquals('Bahaya', $dangerSensor->status_label);
    }

    public function test_sensor_active_scope(): void
    {
        Sensor::factory()->count(3)->create(['is_active' => true]);
        Sensor::factory()->count(2)->create(['is_active' => false]);

        $activeSensors = Sensor::active()->get();

        $this->assertCount(3, $activeSensors);
    }

    public function test_sensor_by_status_scope(): void
    {
        Sensor::factory()->count(2)->create(['status' => Sensor::STATUS_SAFE]);
        Sensor::factory()->count(3)->create(['status' => Sensor::STATUS_WARNING]);
        Sensor::factory()->count(1)->create(['status' => Sensor::STATUS_DANGER]);

        $safeSensors = Sensor::byStatus(Sensor::STATUS_SAFE)->get();
        $warningSensors = Sensor::byStatus(Sensor::STATUS_WARNING)->get();
        $dangerSensors = Sensor::byStatus(Sensor::STATUS_DANGER)->get();

        $this->assertCount(2, $safeSensors);
        $this->assertCount(3, $warningSensors);
        $this->assertCount(1, $dangerSensors);
    }

    public function test_sensor_has_water_level_logs_relationship(): void
    {
        $sensor = Sensor::factory()->create();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $sensor->waterLevelLogs());
    }

    public function test_sensor_casts_attributes_correctly(): void
    {
        $sensor = Sensor::factory()->create([
            'latitude' => -6.12345678,
            'longitude' => 106.12345678,
            'water_level' => 2.50,
            'is_active' => true,
        ]);

        $this->assertIsFloat($sensor->latitude + 0);
        $this->assertIsFloat($sensor->longitude + 0);
        $this->assertIsBool($sensor->is_active);
    }
}
