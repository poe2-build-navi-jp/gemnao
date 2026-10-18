import type { LocalizedArticle } from './types';

export const palworldBackupEn: LocalizedArticle[] = [
  {
    locale: 'en',
    gameSlug: 'palworld',
    gameName: 'Palworld',
    slug: 'dedicated-server-backup',
    checkedAt: '2026-10-18',
    title:
      'Palworld Dedicated Server Backup: Save, Shut Down and Copy the World',
    shortTitle: 'Dedicated server backups',
    description:
      'Protect a Palworld dedicated server with automatic backups and an independent copy of its whole WorldID folder. Save, shut down cleanly and verify the copy before an update.',
    lead: 'For the owner or authorized administrator of a Palworld dedicated server. This covers backing up the server world and player files, not copying a client save or migrating a local co-op host.',
    summary:
      'Enable the official backup option in the active server configuration, then make an independent copy before important changes. Save the world, announce a graceful shutdown, verify that the server process has stopped, and copy the complete WorldID folder. A backup on the same server disk does not protect against losing that disk.',
    sourcePolicy:
      'The linked official server documentation was checked for the backup option, active configuration paths, retention schedule and commands. The world-folder layout is retained from the existing Japanese guide; hosting roots can differ. This is a preservation procedure, not a tested restoration or migration guarantee.',
    quickFacts: [
      {
        label: 'Typical server save directory',
        value: String.raw`PalServer\Pal\Saved\SaveGames\0`,
      },
      {
        label: 'Copy together',
        value:
          'The complete WorldID folder, including Players and every world file',
      },
      {
        label: 'Automatic backup option',
        value: 'bIsUseBackupSaveData=True',
        copy: true,
      },
      {
        label: 'Before the independent copy',
        value:
          'Save → notify players and shut down → verify the process stopped',
      },
    ],
    diagnosis: [
      {
        symptom: 'Several world folders are present',
        cause: 'Timestamps alone do not prove which world the server uses',
        stepId: 'locate-world',
      },
      {
        symptom: 'Changing the default INI did not enable backups',
        cause: 'The running server uses its active configuration file',
        stepId: 'enable-backup',
      },
      {
        symptom: 'Preparing for an update or maintenance',
        cause: 'Files may still change while the server is running',
        stepId: 'save-and-stop',
      },
      {
        symptom: 'Backups exist only beside the live save',
        cause: 'A server-disk failure could remove both copies',
        stepId: 'copy-world',
      },
    ],
    steps: [
      {
        id: 'locate-world',
        title: 'Identify the active WorldID folder',
        summary:
          'Keep the world and player data together, with the original folder names.',
        time: 'About 2 minutes',
        actions: [
          String.raw`Open PalServer\Pal\Saved\SaveGames\0 in the actual server installation. On Linux, use forward slashes; a host may expose a different parent directory.`,
          'Locate the WorldID folders, whose names are long strings rather than friendly world names.',
          'Use modification times only to narrow candidates. If the active WorldID is uncertain, stop the server before preserving the entire SaveGames directory; do not overwrite a guessed world.',
          'Inspect the candidate folder for Players and the world files. Record the full original path and WorldID so the copy remains identifiable.',
        ],
      },
      {
        id: 'enable-backup',
        title: 'Enable the official automatic backup option',
        summary:
          'Edit the active server configuration, keeping a copy of its previous contents.',
        time: 'One maintenance window',
        actions: [
          'Arrange a maintenance window and stop the dedicated server cleanly. Confirm that it has stopped before editing its configuration.',
          String.raw`Preserve a copy of Pal\Saved\Config\WindowsServer\PalWorldSettings.ini under the active PalServer installation. On Linux the corresponding path is Pal/Saved/Config/LinuxServer/PalWorldSettings.ini.`,
          'Set bIsUseBackupSaveData=True in that active configuration, preserving its existing INI structure and other settings. Editing only DefaultPalWorldSettings.ini does not apply the change.',
          'Save the configuration and start the server. If it fails to start, preserve the error details and restore your configuration copy; do not reset unrelated settings.',
          'Check that a backup directory and nonempty backup files appear under the save data. A folder alone is not proof that useful backups are being written.',
        ],
        note: 'The official guide lists five saves at 30-second intervals, six at 10-minute intervals, twelve at hourly intervals and seven at daily intervals. These are rotating backups: monitor disk space and do not treat them as permanent archives.',
      },
      {
        id: 'save-and-stop',
        title: 'Save the world and shut down cleanly',
        summary:
          'Prevent the server from changing files during the independent copy.',
        time: 'One announced maintenance window',
        actions: [
          'An authorized administrator must have set AdminPassword in the active configuration while the server was stopped, then started the server with that configuration. Keep the password private.',
          'In the game, use /AdminPassword <your password> to obtain server administration privileges. Do not display the command in a stream, screenshot or public log.',
          'Run /Save to save the world. If the command fails, resolve the failure before treating the world as saved.',
          'Use /Shutdown [Seconds] [MessageText] with an appropriate delay and a clear maintenance notice. The official command notifies participants and shuts down after the delay.',
          'Confirm in the server console or hosting panel that the server process has fully stopped and will not automatically restart during the copy. A disconnected game client is not sufficient confirmation.',
        ],
      },
      {
        id: 'copy-world',
        title: 'Copy the complete world to independent storage',
        summary:
          'Keep an identifiable copy outside the live server and its rotating backups.',
        time: 'Depends on world size',
        actions: [
          'While the server remains stopped, copy the entire identified WorldID folder. Do not copy only Level.sav or mix player files from a different point in time.',
          'Paste it into independent storage outside the server, preferably on another drive. Put a date on the outer backup folder and keep the WorldID folder name unchanged.',
          'Record the server version, backup time, original path and WorldID. Preserve the active configuration separately, with restricted access because it can contain passwords.',
          'Open the destination and compare its Players directory and all world files with the stopped source. Compare file counts and byte sizes, and investigate missing or different files before restarting. Matching counts and sizes check copy completeness; they do not prove the game can load the save.',
        ],
      },
    ],
    avoid: [
      'Do not replace live world files while the server is running or restarting.',
      'Do not use /DoExit as the routine backup shutdown: the official guide describes it as a forced stop.',
      'Do not assume enabling automatic backups recovers an earlier state that was never backed up.',
      'Do not publish configuration files, admin credentials or player data with a support request.',
    ],
    cautions: [
      'This guide stops at preserving and checking a copy. Before any restoration, retain the current world and confirm the target server version and WorldID; do not test a rollback on the only live copy.',
      'Server owners should coordinate downtime with players. A managed host may control shutdown, automatic restarts and access to save files.',
      'Automatic backups increase disk load. Check available space and actual backup output after enabling them.',
    ],
    faqs: [
      {
        question: 'Where are dedicated server saves?',
        answer: String.raw`The existing Japanese guide uses PalServer\Pal\Saved\SaveGames\0\<WorldID>. Treat PalServer as the installation root, not a universal absolute path. Hosting services can change the parent path. Identify the world in your own installation before copying or restoring anything.`,
      },
      {
        question: 'What does bIsUseBackupSaveData enable?',
        answer:
          'The official server guide says it creates backups in a backup directory within the save data, using several retention intervals. It also increases disk load. Check that actual files appear; saving the setting alone does not verify a usable backup.',
      },
      {
        question: 'Are automatic backups enough?',
        answer:
          'They help preserve recent states but remain on server storage and rotate. Keep an independent dated copy before an update or other significant change. Verify the copied files and retain the original until any separate restoration test has been assessed.',
      },
    ],
    sources: [
      {
        label:
          'Official Palworld Server Guide: configuration and automatic backups',
        url: 'https://docs.palworldgame.com/settings-and-operation/configuration/',
      },
      {
        label: 'Official Palworld Server Guide: administrative commands',
        url: 'https://docs.palworldgame.com/settings-and-operation/commands/',
      },
    ],
    related: [
      {
        href: '/en/guide/save-data-backup',
        label: 'Check an independent save backup',
      },
      {
        href: '/en/games/palworld/save-data',
        label: 'Local Steam world backups',
      },
      {
        href: '/en/games/palworld/dedicated-server-settings',
        label: 'Dedicated server settings',
      },
    ],
  },
];
