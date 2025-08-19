import { StarIcon, UserIcon, CalendarIcon, HandThumbUpIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewsSectionProps {
  reviews: Review[]
  rating: number
  reviewCount: number
}

export default function ReviewsSection({ reviews, rating, reviewCount }: ReviewsSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <StarIcon className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">
          This vendor hasn't received any reviews yet. Be the first to share your experience!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-gray-600">
              Based on {reviewCount} customer review{reviewCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-1">{rating.toFixed(1)}</div>
            <div className="flex items-center justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {rating >= 4.5 ? 'Excellent' : 
               rating >= 4.0 ? 'Very Good' : 
               rating >= 3.5 ? 'Good' : 
               rating >= 3.0 ? 'Average' : 'Below Average'}
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating Breakdown</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars as keyof typeof ratingDistribution]
                const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0
                return (
                  <div key={stars} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm text-gray-600">{stars}</span>
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Highlights</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <HandThumbUpIcon className="h-4 w-4 text-green-500" />
                <span className="text-gray-700">
                  {ratingDistribution[5] + ratingDistribution[4]} customers recommend this vendor
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700">
                  {reviews.filter(r => r.comment.length > 50).length} detailed reviews
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-purple-500" />
                <span className="text-gray-700">
                  Most recent: {formatDate(reviews[0]?.createdAt || '')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">All Reviews</h3>
        
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </div>
              </div>

              {/* Review Content */}
              <div className="text-gray-700 leading-relaxed">
                {review.comment}
              </div>

              {/* Review Actions */}
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                                  <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <HandThumbUpIcon className="h-4 w-4" />
                    <span>Helpful</span>
                  </button>
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
        <h3 className="text-xl font-semibold mb-3">Share Your Experience</h3>
        <p className="mb-4 opacity-90">
          Have you worked with this vendor? Help other customers by sharing your review.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200 font-medium">
          Write a Review
        </button>
      </div>

      {/* Review Guidelines */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Guidelines</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Reviews must be based on actual experience with the vendor</p>
          <p>• Be specific about the services received and quality of work</p>
          <p>• Keep reviews constructive and respectful</p>
          <p>• Include relevant details like project scope and timeline</p>
          <p>• Reviews are moderated to ensure quality and authenticity</p>
        </div>
      </div>
    </div>
  )
}