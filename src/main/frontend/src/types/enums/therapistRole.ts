export enum TherapistRole {
    Psychologist = 'PSYCHOLOGIST',
    SpeechTherapist = 'SPEECH_THERAPIST',
    Physiotherapist = 'PHYSIOTHERAPIST',
    Pedagogue = 'PEDAGOGUE',
    Other = 'OTHER',
}

export const TherapistRoleLabels: Record<TherapistRole, string> = {
    [TherapistRole.Psychologist]: 'Psycholog',
    [TherapistRole.SpeechTherapist]: 'Logopeda',
    [TherapistRole.Physiotherapist]: 'Fizjoterapeuta',
    [TherapistRole.Pedagogue]: 'Pedagog',
    [TherapistRole.Other]: 'Inna',
};
