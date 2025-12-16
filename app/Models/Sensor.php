<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sensor extends Model
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
        'name',
        'code',
        'latitude',
        'longitude',
        'status',
        'water_level',
        'address',
        'description',
        'is_active',
        'last_reading_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'water_level' => 'decimal:2',
        'is_active' => 'boolean',
        'last_reading_at' => 'datetime',
    ];

    public function waterLevelLogs(): HasMany
    {
        return $this->hasMany(WaterLevelLog::class);
    }

    public function latestLog(): HasMany
    {
        return $this->hasMany(WaterLevelLog::class)->latest('recorded_at')->limit(1);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
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
}
