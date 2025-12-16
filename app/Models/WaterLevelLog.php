<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaterLevelLog extends Model
{
    use HasFactory;

    public const STATUS_SAFE = 'safe';
    public const STATUS_WARNING = 'warning';
    public const STATUS_DANGER = 'danger';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sensor_id',
        'water_level',
        'status',
        'recorded_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'water_level' => 'decimal:2',
        'recorded_at' => 'datetime',
    ];

    public function sensor(): BelongsTo
    {
        return $this->belongsTo(Sensor::class);
    }

    public function scopeBySensor($query, int $sensorId)
    {
        return $query->where('sensor_id', $sensorId);
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('recorded_at', [$startDate, $endDate]);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_SAFE => '#22c55e',
            self::STATUS_WARNING => '#eab308',
            self::STATUS_DANGER => '#ef4444',
            default => '#6b7280',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_SAFE => 'Aman',
            self::STATUS_WARNING => 'Siaga',
            self::STATUS_DANGER => 'Bahaya',
            default => 'Tidak Diketahui',
        };
    }

    public static function calculateStatus(float $waterLevel): string
    {
        if ($waterLevel <= 50) {
            return self::STATUS_SAFE;
        } elseif ($waterLevel <= 100) {
            return self::STATUS_WARNING;
        } else {
            return self::STATUS_DANGER;
        }
    }
}
