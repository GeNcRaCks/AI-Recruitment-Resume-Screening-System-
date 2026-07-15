import pandas as pd 
import numpy as np

#pandas
data = {
    "name" : ["Ali", "Usman", "Hamza"],
    "years_experience" : [2,5,1],
    "skills_matched" : [8,12,4],
    "skills_total" : [15,15,15],
}

df = pd.DataFrame(data)
df["match_pct"] = (df["skills_matched"] / df["skills_total"]* 100).round(1)
df_sorted = df.sort_values("match_pct", ascending=False)
print(df_sorted)

print("\nCandidates with more than 2 years experience:")
experienced = df[df["years_experience"] > 2]
print(experienced)
print("\nAverage experience:")
print(df["years_experience"].mean())

# GroupBy Example
data2 = {
    "department": ["AI", "AI", "Web", "Web"],
    "salary": [80000, 90000, 60000, 65000]
}
df2 = pd.DataFrame(data2)
print("\nAverage Salary by Department:")
print(df2.groupby("department")["salary"].mean())


#numpy
weights = np.array([0.4, 0.3, 0.3])
scores = np.array([[0.8, 0.6, 0.7],[0.9, 0.9, 0.85],[0.3, 0.2, 0.4]])
final_scores = scores @ weights #matrix multiplication
print(final_scores)

numbers = np.array([10, 20, 30, 40])
print("\nOriginal Array:")
print(numbers)
print("\nAdd 5 to every element (Broadcasting):")
print(numbers + 5)
print("\nMean:", np.mean(numbers))
print("Maximum:", np.max(numbers))
print("Minimum:", np.min(numbers))
print("Sum:", np.sum(numbers))

#spacy / nlp
import spacy
nlp = spacy.load("en_core_web_sm")

text = "ALi has 5 years of experience in python, SQL, and Machine Learning at Yumaj"
doc = nlp(text)
print([token.text for token in doc]) #extract words

clean_tokens = [token.lemma_.lower() for token in doc if not token.is_stop and token.is_alpha] #stopwords removal, lemmatization, lowercasing, and removing punctuation
print(clean_tokens)

for token in doc[:8]:
    print(token.text, ": ", token.pos_) #Parts Of Speech tagging

text2 = "Ali loves Python. He is learning Artificial Intelligence."
doc3 = nlp(text2)
print("\nSentences:")
for sentence in doc3.sents:
    print(sentence)

print("\nLemmas:")
for token in doc3:
    print(token.text, ":", token.lemma_)


sample_resume = """John Doe worked at Google from 2019 to 2022 as a Software Engineer.
He holds a degree from MIT and knows Python, Java, and AWS."""
doc2 = nlp(sample_resume)
for ent in doc2.ents:
    print(ent.text, ":", ent.label_) #NER
