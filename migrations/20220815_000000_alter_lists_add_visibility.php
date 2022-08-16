<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasColumn('discussion_lists', 'visibility')) {
            $schema->table('discussion_lists', function (Blueprint $table) {
                $table->string('visibility')->default('private')->after('name')->index();
            });
        }

        $schema->getConnection()->table('discussion_lists')->update([
            'visibility' => $schema->getConnection()->raw("if(is_public, 'public', 'private')"),
        ]);

        $schema->table('discussion_lists', function (Blueprint $table) {
            $table->dropColumn('is_public');
        });
    },
    'down' => function (Builder $schema) {
        // Intermediate down migrations aren't really used by Flarum, so we won't bother restoring the values to is_public
        $schema->table('discussion_lists', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->after('name')->index();
            $table->dropColumn('visibility');
        });
    },
];
