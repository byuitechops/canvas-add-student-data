const canvas = require('canvas-wrapper');
const chalkAnimation = require('chalk-animation');

function checkMigration(migration) {
    return new Promise((resolve, reject) => {

        var anims = [
            chalkAnimation.rainbow,
            chalkAnimation.radar,
            chalkAnimation.glitch,
            chalkAnimation.rainbow,
            chalkAnimation.pulse,
        ];

        function check() {
            canvas.get(`/api/v1/courses/4274/blueprint_templates/default/migrations/${migration.id}`, (err, migrationDets) => {
                if (err) return reject(err);
                var anim = anims[Math.floor(Math.random() * 5)];
                var random = Math.ceil(Math.random() * 10);
                anim(`Sync state: ${migrationDets[0].workflow_state}`, random);
                if (migrationDets[0].workflow_state != 'completed') {
                    setTimeout(() => {
                        check();
                    }, 5000);
                } else {
                    resolve();
                }
            });
        }

        check();
    });
}

checkMigration({
    id: '584'
});