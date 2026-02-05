
const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = 'https://emvvohsrpiewmsvjugjm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING_KEY'; // Will need to pass this or hardcode temporarily

if (SUPABASE_KEY === 'MISSING_KEY') {
    console.error('Please provide SUPABASE_SERVICE_ROLE_KEY via env var or file.');
    // Attempting to read .env file manually since dotenv failed
    const fs = require('fs');
    try {
        const envFile = fs.readFileSync('.env', 'utf8');
        const match = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
        if (match) {
            process.env.SUPABASE_SERVICE_ROLE_KEY = match[1].trim();
        }
    } catch (e) {
        console.warn('Could not read .env file');
    }
}

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log('Starting Assessment Flow Verification...');
    
    // 1. Create Course
    const { data: course, error: courseError } = await supabase.from('courses').insert({
        title: 'AutoTest Course ' + Date.now(),
        category: 'Testing',
        level: 'Beginner' // Ensure Title Case
    }).select().single();

    if (courseError) {
        console.error('Create Course Failed:', courseError);
        return;
    }
    console.log('✅ Course Created:', course.id);

    try {
        // 2. Create Week
        const { data: week, error: weekError } = await supabase.from('weeks').insert({
            course_id: course.id,
            title: 'Week 1',
            order_index: 0
        }).select().single();

        if (weekError) throw new Error('Create Week Failed: ' + weekError.message);
        console.log('✅ Week Created:', week.id);

        // 3. Create Lesson (Assessment Type)
        const { data: lesson, error: lessonError } = await supabase.from('lessons').insert({
            week_id: week.id,
            title: 'Test Lesson',
            type: 'assessment',
            order_index: 0
        }).select().single();

        if (lessonError) throw new Error('Create Lesson Failed: ' + lessonError.message);
        console.log('✅ Lesson Created:', lesson.id);

        // 4. Create Assessment
        const { data: assessment, error: assessmentError } = await supabase.from('assessments').insert({
            lesson_id: lesson.id,
            title: 'Test Assessment',
            type: 'quiz',
            show_results: 'immediately', // Valid enum
            created_at: new Date().toISOString()
        }).select().single();

        if (assessmentError) throw new Error('Create Assessment Failed: ' + assessmentError.message);
        console.log('✅ Assessment Created:', assessment.id);

        // 5. Create Question
        const { data: question, error: questionError } = await supabase.from('questions').insert({
            assessment_id: assessment.id,
            title: 'Sample Question',
            description: 'What is 2+2?',
            type: 'multiple_choice',
            difficulty: 'easy',
            marks: 5,
            order_index: 0
        }).select().single();

        if (questionError) throw new Error('Create Question Failed: ' + questionError.message);
        console.log('✅ Question Created:', question.id);

        // 6. Create Answer Options
        const { data: options, error: optionsError } = await supabase.from('answer_options').insert([
            { question_id: question.id, text: '3', is_correct: false, order_index: 0 },
            { question_id: question.id, text: '4', is_correct: true, order_index: 1 }
        ]).select();

        if (optionsError) throw new Error('Create Options Failed: ' + optionsError.message);
        console.log('✅ Options Created:', options.length);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        // Cleanup
        console.log('Cleaning up...');
        await supabase.from('courses').delete().eq('id', course.id);
        console.log('Cleanup Done.');
    }
}

run();
