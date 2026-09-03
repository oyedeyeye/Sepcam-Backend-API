import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          snippet: true,
          image: true,
          date: true,
          readTime: true,
          authorName: true,
          authorRole: true,
          authorAvatar: true,
        }
      }),
      prisma.blogArticle.count()
    ]);

    // Format for frontend spec
    const data = articles.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      snippet: a.snippet,
      image: a.image,
      date: a.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: a.readTime,
      author: {
        name: a.authorName,
        role: a.authorRole,
        avatar: a.authorAvatar
      }
    }));

    res.json({
      data,
      meta: { total, page, limit }
    });
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await prisma.blogArticle.findUnique({ where: { id: id as string } });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const { authorName, authorRole, authorAvatar, ...rest } = article as any;
    
    res.json({
      data: {
        ...rest,
        date: article.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        author: {
          name: authorName,
          role: authorRole,
          avatar: authorAvatar
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const searchArticles = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const whereClause = {
      OR: [
        { title: { contains: keyword } },
        { category: { contains: keyword } },
        { snippet: { contains: keyword } },
        { authorName: { contains: keyword } }
      ]
    };

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          snippet: true,
          image: true,
          date: true,
          readTime: true,
          authorName: true,
          authorRole: true,
          authorAvatar: true,
        }
      }),
      prisma.blogArticle.count({ where: whereClause })
    ]);

    const data = articles.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      snippet: a.snippet,
      image: a.image,
      date: a.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: a.readTime,
      author: {
        name: a.authorName,
        role: a.authorRole,
        avatar: a.authorAvatar
      }
    }));

    res.json({ data, meta: { total, page, limit } });
  } catch (error) {
    console.error('Error searching blog articles:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { author, date, ...rest } = req.body;
    
    const newArticle = await prisma.blogArticle.create({
      data: {
        ...rest,
        authorName: author.name,
        authorRole: author.role,
        authorAvatar: author.avatar,
        date: new Date(date)
      }
    });

    res.status(201).json({ message: 'Article created successfully', data: newArticle });
  } catch (error) {
    console.error('Error creating blog article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { author, date, ...rest } = req.body;

    const dataToUpdate: any = { ...rest };
    if (author) {
      if (author.name) dataToUpdate.authorName = author.name;
      if (author.role) dataToUpdate.authorRole = author.role;
      if (author.avatar) dataToUpdate.authorAvatar = author.avatar;
    }
    if (date) {
      dataToUpdate.date = new Date(date);
    }

    const updatedArticle = await prisma.blogArticle.update({
      where: { id: id as string },
      data: dataToUpdate
    });

    res.json({ message: 'Article updated successfully', data: updatedArticle });
  } catch (error) {
    console.error('Error updating blog article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.blogArticle.delete({ where: { id: id as string } });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
