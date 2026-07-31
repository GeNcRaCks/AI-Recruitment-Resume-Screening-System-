from unittest.mock import patch
from src.generation.questions import generate_interview_questions
from src.generation.summary import generate_candidate_summary
from src.generation.feedback import generate_feedback
from src.generation.pipeline import generate_interview_package


@patch("src.generation.questions.call_llm", return_value="1. Sample question?")
def test_generate_interview_questions_calls_llm(mock_call):
    result = generate_interview_questions("Sample JD", ["Python"], ["AWS"])
    assert result == "1. Sample question?"
    mock_call.assert_called_once()


@patch("src.generation.questions.call_llm", return_value="1. Sample question?")
def test_generate_interview_questions_handles_empty_missing_skills(mock_call):
    generate_interview_questions("Sample JD", ["Python"], [])
    prompt_used = mock_call.call_args[0][0]
    assert "None — candidate matched all detected requirements" in prompt_used


@patch("src.generation.summary.call_llm", return_value="Strong candidate overall.")
def test_generate_candidate_summary(mock_call):
    result = generate_candidate_summary("Sample JD", ["Python"], ["AWS"], 0.75)
    assert result == "Strong candidate overall."


@patch("src.generation.feedback.call_llm", return_value="Consider adding AWS certification.")
def test_generate_feedback_handles_empty_matched_skills(mock_call):
    generate_feedback([], ["AWS"])
    prompt_used = mock_call.call_args[0][0]
    assert "None identified" in prompt_used


@patch("src.generation.pipeline.generate_feedback", side_effect=RuntimeError("API down"))
@patch("src.generation.pipeline.generate_candidate_summary", return_value="Summary text")
@patch("src.generation.pipeline.generate_interview_questions", return_value="1. Question?")
def test_pipeline_survives_partial_failure(mock_q, mock_s, mock_f):
    package = generate_interview_package("JD", ["Python"], ["AWS"], 0.5)
    assert package["questions"] == "1. Question?"
    assert package["summary"] == "Summary text"
    assert "Could not generate feedback" in package["feedback"]