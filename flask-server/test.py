import unittest
from unittest.mock import patch, Mock
from app import app

class TestHighlight(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    @patch('app.client.chat.completions.create')
    def test_highlight(self, mock_create):
        mock_create.return_value = Mock(choices=[Mock(message=Mock(content='Summary 2'))])

        response = self.app.post('/highlight', data={
            'summaries': [
                'The weather was beautiful and I went on a walk', 
                'It is my birthday today, and my friends brought me to an amazing suprise party in Las Vegas', 
                'I had an uneventful day'
                ],
            'quotes': ['Quote 1', 'Quote 2', 'Quote 3'],
            'images': ['Image 1', 'Image 2', 'Image 3'],
            'songs': ['Song 1', 'Song 2', 'Song 3'],
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {
            'summary': 'It is my birthday today, and my friends brought me to a amazing suprize party in Las Vegas',
            'quote': 'Quote 2',
            'image': 'Image 2',
            'song': 'Song 2',
        })

if __name__ == '__main__':
    unittest.main()