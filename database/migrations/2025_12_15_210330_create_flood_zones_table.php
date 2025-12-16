<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flood_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('coordinates');
            $table->enum('risk_level', ['low', 'medium', 'high'])->default('low');
            $table->string('color')->default('#ef4444');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['risk_level', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flood_zones');
    }
};
