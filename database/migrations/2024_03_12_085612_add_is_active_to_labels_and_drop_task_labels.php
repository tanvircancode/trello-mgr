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
        Schema::table('labels', function (Blueprint $table) {
            $table->uuid('task_id');
            $table->boolean('is_active')->default(false);
           
            $table->foreign('task_id')
            ->references('id')->on('tasks')
            ->onDelete('cascade');
        });

        // Dropping task_labels table
        Schema::dropIfExists('task_labels');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       
    }
};
