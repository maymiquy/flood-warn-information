<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FloodZone extends Model
{
    use HasFactory;
    public const RISK_LOW = 'low';
    public const RISK_MEDIUM = 'medium';
    public const RISK_HIGH = 'high';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'coordinates',
        'risk_level',
        'color',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'coordinates' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByRiskLevel($query, string $riskLevel)
    {
        return $query->where('risk_level', $riskLevel);
    }

    public function getRiskColorAttribute(): string
    {
        return match ($this->risk_level) {
            self::RISK_LOW => '#22c55e',
            self::RISK_MEDIUM => '#eab308',
            self::RISK_HIGH => '#ef4444',
            default => '#6b7280',
        };
    }

    public function getRiskLabelAttribute(): string
    {
        return match ($this->risk_level) {
            self::RISK_LOW => 'Rendah',
            self::RISK_MEDIUM => 'Sedang',
            self::RISK_HIGH => 'Tinggi',
            default => 'Tidak Diketahui',
        };
    }

    public function getOpacityAttribute(): float
    {
        return match ($this->risk_level) {
            self::RISK_LOW => 0.3,
            self::RISK_MEDIUM => 0.4,
            self::RISK_HIGH => 0.5,
            default => 0.3,
        };
    }
}
