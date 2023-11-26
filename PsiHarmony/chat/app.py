from flask import Flask, render_template, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
import pandas as pd
import re
from string import punctuation
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)

# Load the dataset
faq = pd.read_csv('C:/Users/winst/Documents/GitHub/Pybot/Mental_Health_FAQ.csv')  # Use forward slashes

# Preprocess the data
contractions_dict = {
    "ain't": "am not",
    "aren't": "are not",
    "can't": "cannot",
    "can't've": "cannot have",
    "'cause": "because",
    "could've": "could have",
    "couldn't": "could not",
    "couldn't've": "could not have",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hadn't've": "had not have",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he had",
    "he'd've": "he would have",
    "he'll": "he will",
    "he'll've": "he will have",
    "he's": "he is",
    "how'd": "how did",
    "how'd'y": "how do you",
    "how'll": "how will",
    "how's": "how is",
    "I'd": "I had",
    "I'd've": "I would have",
    "I'll": "I will",
    "I'll've": "I will have",
    "I'm": "I am",
    "I've": "I have",
    "isn't": "is not",
    "it'd": "it had",
    "it'd've": "it would have",
    "it'll": "it will",
    "it'll've": "it will have",
    "it's": "it is",
    "let's": "let us",
    "ma'am": "madam",
    "mayn't": "may not",
    "might've": "might have",
    "mightn't": "might not",
    "mightn't've": "might not have",
    "must've": "must have",
    "mustn't": "must not",
    "mustn't've": "must not have",
    "needn't": "need not",
    "needn't've": "need not have",
    "o'clock": "of the clock",
    "oughtn't": "ought not",
    "oughtn't've": "ought not have",
    "shan't": "shall not",
    "sha'n't": "shall not",
    "shan't've": "shall not have",
    "she'd": "she had",
    "she'd've": "she would have",
    "she'll": "she will",
    "she'll've": "she will have",
    "she's": "she is",
    "should've": "should have",
    "shouldn't": "should not",
    "shouldn't've": "should not have",
    "so've": "so have",
    "so's": "so is",
    "that'd": "that had",
    "that'd've": "that would have",
    "that's": "that is",
    "there'd": "there had",
    "there'd've": "there would have",
    "there's": "there is",
    "they'd": "they had",
    "they'd've": "they would have",
    "they'll": "they will",
    "they'll've": "they will have",
    "they're": "they are",
    "they've": "they have",
    "to've": "to have",
    "wasn't": "was not",
    "we'd": "we had",
    "we'd've": "we would have",
    "we'll": "we will",
    "we'll've": "we will have",
    "we're": "we are",
    "we've": "we have",
    "weren't": "were not",
    "what'll": "what will",
    "what'll've": "what will have",
    "what're": "what are",
    "what's": "what is",
    "what've": "what have",
    "when's": "when is",
    "when've": "when have",
    "where'd": "where did",
    "where's": "where is",
    "where've": "where have",
    "who'll": "who will",
    "who'll've": "who will have",
    "who's": "who is",
    "who've": "who have",
    "why's": "why is",
    "why've": "why have",
    "will've": "will have",
    "won't": "will not",
    "won't've": "will not have",
    "would've": "would have",
    "wouldn't": "would not",
    "wouldn't've": "would not have",
    "y'all": "you all",
    "y'all'd": "you all would",
    "y'all'd've": "you all would have",
    "y'all're": "you all are",
    "y'all've": "you all have",
    "you'd": "you had",
    "you'd've": "you would have",
    "you'll": "you will",
    "you'll've": "you will have",
    "you're": "you are",
    "you've": "you have",
    "iit": "it",
}

wordnet_lemma = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    # Expand contractions
    def expand_contraction(text, contraction_dict):
        contraction_pattern = re.compile('({})'.format('|'.join(contraction_dict.keys())), flags=re.IGNORECASE | re.DOTALL)
        
        def expand_match(contraction):
            match = contraction.group(0)
            expanded_contraction = contraction_dict.get(match) if contraction_dict.get(match) else contraction_dict.get(match.lower())
            return expanded_contraction
        
        expanded_text = contraction_pattern.sub(expand_match, text)
        expanded_text = re.sub("'", "", expanded_text)
        return expanded_text
    
    # Main contraction function
    def main_contraction(text):
        text = expand_contraction(text, contractions_dict)
        return text
    
    # Additional preprocessing steps
    text = text.lower()
    text = main_contraction(text)
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text, re.I | re.A)  # Remove non-alphabetic characters
    text = re.sub("(.)\\1{2,}", "\\1", text)  # Remove duplicate characters
    text = ' '.join([wordnet_lemma.lemmatize(word) for word in text.split() if word not in stop_words])  # Lemmatization
    
    return text

faq['preprocessed_questions'] = faq['Questions'].apply(preprocess_text)

# Train the machine learning model
text = faq['preprocessed_questions']
y = faq.index.values

tfidf = TfidfVectorizer(use_idf=True, analyzer='word', stop_words='english', token_pattern=r'\b[^\d\W]+\b', ngram_range=(1, 2))
X_train = tfidf.fit_transform(text)

lsvc = LinearSVC(random_state=2021)
lsvc.fit(X_train, y)

# Existing routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    user_message = request.json.get('message', '')

    # Preprocess the user's message
    user_message = preprocess_text(user_message)

    # Use the machine learning model to predict the answer
    search_engine = tfidf.transform([user_message])
    result = lsvc.predict(search_engine)

    # Get the corresponding answer from the dataset
    predicted_answer = faq.loc[result[0], 'Answers']

    return jsonify({'answer': predicted_answer})

if __name__ == '__main__':
    app.run(debug=True)
