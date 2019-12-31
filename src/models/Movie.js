import { Model } from "@nozbe/watermelondb"
import { field, date, children } from "@nozbe/watermelondb/decorators"
import { action } from '@nozbe/watermelondb/decorators'

export default class Movie extends Model {
  static table = "movies"

  static associations = {
    reviews: { type: "has_many", foreignKey: "movie_id" }
  }

  @field("title") title
  @field("poster_image") posterImage
  @field("genre") genre
  @field("description") description

  @date("release_date_at") releaseDateAt

  @children("reviews") reviews

  getMovie() {
    return {
      title: this.title,
      posterImage: this.posterImage,
      genre: this.genre,
      description: this.description,
      releaseDateAt: this.releaseDateAt
    }
  }

  @action async addReview(body) {
    return this.collections.get("reviews").create(review => {
      review.movie.set(this)
      review.body = body
    })
  }

  @action async updateMovie(updatedMovie) {
    await this.update(movie => {
      movie.title = updatedMovie.title
      movie.genre = updatedMovie.genre
      movie.posterImage = updatedMovie.posterImage
      movie.description = updatedMovie.description
      movie.releaseDateAt = updatedMovie.releaseDateAt
    })
  }

  async deleteAllReview() {
    await this.reviews.destroyAllPermanently()
  }

  @action async deleteMovie() {
    await this.deleteAllReview() // delete all reviews first
    await this.markAsDeleted() // syncable
    await this.destroyPermanently() // permanent
  }

}
