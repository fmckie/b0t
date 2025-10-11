import axios from 'axios';

/**
 * Instagram Graph API Client
 *
 * Requires:
 * - Instagram Business or Creator Account
 * - Linked to Facebook Page
 * - Access token from Facebook OAuth
 */

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const GRAPH_API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

if (!INSTAGRAM_ACCESS_TOKEN) {
  console.warn('⚠️  Instagram access token not set. Instagram features will not work.');
}

/**
 * Reply to an Instagram comment
 *
 * @param commentId - The Instagram comment ID
 * @param message - Your reply message
 */
export async function replyToInstagramComment(commentId: string, message: string) {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/${commentId}/replies`,
      {
        message,
      },
      {
        params: {
          access_token: INSTAGRAM_ACCESS_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error replying to Instagram comment:', error);
    throw error;
  }
}

/**
 * Get comments on an Instagram media post
 */
export async function getInstagramComments(mediaId: string) {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  try {
    const response = await axios.get(`${BASE_URL}/${mediaId}/comments`, {
      params: {
        access_token: INSTAGRAM_ACCESS_TOKEN,
        fields: 'id,text,username,timestamp',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram comments:', error);
    throw error;
  }
}

/**
 * Send Instagram Direct Message (DM)
 *
 * Note: Requires Messenger API for Instagram
 * Requires Instagram Professional account linked to Facebook Page
 */
export async function sendInstagramDM(recipientId: string, message: string) {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message },
      },
      {
        params: {
          access_token: INSTAGRAM_ACCESS_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending Instagram DM:', error);
    throw error;
  }
}

/**
 * Reply to an Instagram DM
 */
export async function replyToInstagramDM(senderId: string, message: string) {
  // Same as sendInstagramDM - just replying to the sender
  return sendInstagramDM(senderId, message);
}

/**
 * Get Instagram media (posts) for the authenticated user
 */
export async function getInstagramMedia(limit = 10) {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  try {
    const response = await axios.get(`${BASE_URL}/me/media`, {
      params: {
        access_token: INSTAGRAM_ACCESS_TOKEN,
        fields: 'id,caption,media_type,media_url,timestamp,like_count,comments_count',
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
}
