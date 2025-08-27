export enum TherapistRole {
    Psychologist = 'PSYCHOLOGIST',
    SpeechTherapist = 'SPEECH_THERAPIST',
    PhysioTherapist = 'PHYSIO_THERAPIST',
    Pedagogue = 'PEDAGOGUE',
    Other = 'OTHER',
}

export const TherapistRoleLabels: Record<TherapistRole, string> = {
    [TherapistRole.Psychologist]: 'Psycholog',
    [TherapistRole.SpeechTherapist]: 'Logopeda',
    [TherapistRole.PhysioTherapist]: 'Fizjoterapeuta',
    [TherapistRole.Pedagogue]: 'Pedagog',
    [TherapistRole.Other]: 'Inna',
};
